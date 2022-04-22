import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from '../../components';
import { Layout } from '../../components/account';
import { userService, alertService } from '../../services';

export default Login;

function Login() {
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('name is required'),
        surname: Yup.string().required('surname is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ name, surname }) {
        return userService.login(name, surname)
            .then(() => {
                // get return url from query parameters or default to '/'
                const returnUrl = router.query.returnUrl || '/home';
                router.push(returnUrl);
            })
            .catch(alertService.error);
    }

    return (
        <Layout>
            <div><h1 align="center" className="mainheader">WELCOME TO THE QUIZ APP!</h1></div>
            <div className="card">
                <h4 className="card-header">Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.name?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Second Name</label>
                            <input name="surname" type="surname" {...register('surname')} className={`form-control ${errors.surname ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.surname?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Login
                        </button>
                        <Link href="/account/register" className="btn btn-link">Register</Link>
                    </form>
                </div>
            </div>
        </Layout>
    );
}