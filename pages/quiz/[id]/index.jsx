import {useState} from "react";
    import {useRouter} from "next/router";
    import {getAll, getById, getScore} from "../../quiz";
    
    const getQuestion = (questions, index) => {
        return questions[index];
    };
    
    export async function getStaticProps({params}) {
        const quiz = await getById(params.id);
        // console.log('quiz: ' + JSON.stringify(quiz));
        return {
            props: {
                quiz
            }
        }
    }
    
    export async function getStaticPaths() {
        const quizzes = await getAll();
        // console.log('quizzes: ' + quizzes);
        const paths = quizzes.map(quiz => ({params: {id: `${quiz.id}`}}));
        // console.log('paths: ' + JSON.stringify(paths));
        return {
            paths,
            fallback: false
        }
    }
    
    const Quiz = ({quiz}) => {
        const router = useRouter();
        const [index, setIndex] = useState(0);
        const [correctAnswers, setCorrectAnswers] = useState(new Set());
        const question = getQuestion(quiz.questions, index);
        console.log('quiz: ' + JSON.stringify(quiz));
    
        const hasNext = () => {
            return index < quiz.questions.length - 1;
        };
    
        const isCorrectlyAnswered = () => {
            return correctAnswers.has(index);
        };
    
        const nextQuestion = () => {
            if (!hasNext()) {
                finishQuiz();
            } else {
                setIndex(index + 1);
            }
        };
    
        const hasPrev = () => {
            return index > 0;
        };
    
        const prevQuestion = () => {
            if (index !== 0) {
                setIndex(index - 1);
            }
        };
    
        const finishQuiz = () => {
            // alert(`Your score is ${correctAnswers.size}`);
            alert(`Your score is 3`);
            router.push("/home");
        };
    
        const checkOption = (quiz_id, question_id, user_id, option) => {
            // if (option.isCorrect && !isCorrectlyAnswered()) {
            //     correctAnswers.add(index);
            //     setCorrectAnswers(correctAnswers);
            // } else if (!option.isCorrect && isCorrectlyAnswered()) {
            //     correctAnswers.delete(index);
            //     setCorrectAnswers(correctAnswers);
            // }

            console.log(option);
            
            const answer = getScore(quiz_id, question_id, user_id, option);

            console.log(answer);
            if (answer.correct == true) {
                correctAnswers.add(index);
                setCorrectAnswers(correctAnswers);
            }

            nextQuestion();
        };
    
        return (
            <div className="container font-sans px-4">
                <div className="text-3xl font-bold my-8">{quiz.title}</div>
                <div className="flex flex-col rounded-md shadow-md w-full py-4 px-4 mb-4">
                    <div className="font-bold">Question {index + 1}</div>
                    <div>{question.question}</div>
                </div>
                <div className="flex flex-initial flex-wrap justify-between text-center gap-4">
                    {question.answers.map((option) => (
                        <button
                            // key={option.id}
                            onClick={() => checkOption(quiz.id, question.id, 1061, option)}
                            className="block md:w-5/12 w-full option rounded-md shadow-md p-2"
                        >
                            {option}
                        </button>
                    ))}
                </div>
    
                <div className="flex gap-x-4 mt-10 justify-center">
                    {hasPrev() ? (
                        <p className="px-2 button rounded border border-green-500">
                            <button onClick={prevQuestion}>Previous</button>
                        </p>
                    ) : null}
    
                    {hasNext() ? (
                        <p className="px-2 button rounded border border-green-500">
                            <button onClick={nextQuestion}>Next</button>
                        </p>
                    ) : null}
                </div>
            </div>
        );
    };
    
    export default Quiz;