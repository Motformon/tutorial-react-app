import React, {Component} from "react";
import classes from "./Quiz.module.scss"
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import Loader from "../../components/UI/Loader/Loader";
import {connect} from 'react-redux'
import { fetchQuizById } from "../../store/actions/quiz";
class Quiz extends Component {


	onAnswerClickHandler = (answerId) => {

		if(this.state.answerState) {
			const key = Object.keys(this.state.answerState)[0]
			if(this.state.answerState[key] === 'AnswerItem__success') {
				return
			}
		}

		const question = this.state.quiz[this.state.activeQuestion];
		const results = this.state.results;

		if(question.rightAnswerId === answerId) {
			if(!results[question.id]) {
				results[question.id] = 'success'
			}
			this.setState({
				answerState: {[answerId]: 'AnswerItem__success'},
				results 
			})

			const timeout = window.setTimeout(() => {

				if(this.isQuezFinished()) {
					this.setState({
						isFinished: true
					})
				} else {
					this.setState({
						activeQuestion: this.state.activeQuestion + 1,
						answerState: null
					})
				}

				window.clearTimeout(timeout);
			}, 1000)


		} else {
			results[question.id] = "error";
			this.setState({
				answerState: {[answerId]: 'AnswerItem__error'},
				results: results
			})

		}

	}

	isQuezFinished() {
		return this.state.activeQuestion + 1 === this.state.quiz.length;
	}

	retryHandler = () => {
		this.setState({
			activeQuestion: 0,
			answerState: null,
			isFinished: false,
			results: {}
		}) 
	}

	componentDidMount() {
		this.props.fetchQuizById(this.props.match.params.id);
	}

	render() { 
		return (
			<div className={classes.Quiz}>
			
				<div className={classes.Quiz__wrapper}>
					<h1>Ответьте на все вопросы</h1>
					{
						this.props.loading || !this.props.quiz
							? <Loader/>
							:	this.props.isFinished
								? <FinishedQuiz
										results={this.props.results}
										quiz={this.props.quiz}
										onRetry={this.retryHandler}
									/>
								: <ActiveQuiz
										answers={this.props.quiz[this.props.activeQuestion].answers}
										question={this.props.quiz[this.props.activeQuestion].question}
										onAnswerClick={this.onAnswerClickHandler}
										quizLength={this.props.quiz.length}
										answerNumber={this.props.activeQuestion + 1}
										state={this.props.answerState}
									/>
					}


				</div>
			</div>
		)
	}
}


function mapStateToProps(state) {
	return {
		loading: state.quiz.loading,
		results: state.quiz.results,
		isFinished: state.quiz.isFinished,
		activeQuestion: state.quiz.activeQuestion,
		answerState: state.quiz.answerState,
		quiz: state.quiz.quiz
	}
}

function mapDispatchToProps(dispatch) {
	return {
		fetchQuizById: (id) => dispatch(fetchQuizById(id))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
