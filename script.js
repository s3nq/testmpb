document.addEventListener('DOMContentLoaded', () => {
	fetch('questions.json')
		.then(response => response.json())
		.then(questions => {
			const questionContainer = document.getElementById('question-container')
			const prevBtn = document.getElementById('prev-btn')
			const nextBtn = document.getElementById('next-btn')
			const shuffleBtn = document.getElementById('shuffle-btn')
			const showResultsBtn = document.getElementById('show-results-btn')
			const resultsTable = document.getElementById('results-table')
			const resultsContainer = document.getElementById('results-container')
			let currentQuestionIndex = 0
			let userAnswers = []
			let testMode = document.querySelector(
				'input[name="test-mode"]:checked'
			).value
			let originalQuestionsOrder = Array.from(questions)
			let shuffledQuestions = []

			function shuffleArray(array) {
				for (let i = array.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1))
					;[array[i], array[j]] = [array[j], array[i]]
				}
				return array
			}

			function getRandomQuestions(arr, n) {
				const result = new Array(n)
				let len = arr.length
				const taken = new Array(len)

				if (n > len) {
					throw new RangeError(
						'getRandomQuestions: more elements taken than available'
					)
				}

				while (n--) {
					const x = Math.floor(Math.random() * len)
					result[result.length] = arr[x in taken ? taken[x] : x]
					taken[x] = true
				}
				return result
			}

			function initializeTest() {
				testMode = document.querySelector(
					'input[name="test-mode"]:checked'
				).value
				if (testMode === '20') {
					shuffledQuestions = getRandomQuestions(questions, 20)
					userAnswers = Array(20).fill(null)
				} else {
					shuffledQuestions = shuffleArray(Array.from(questions))
					userAnswers = Array(questions.length).fill(null)
				}
				currentQuestionIndex = 0
				showQuestion(currentQuestionIndex)
				updateNavigation()
			}

			function showQuestion(index) {
				const question = shuffledQuestions[index]
				questionContainer.innerHTML = `<p>Вопрос ${index + 1}: ${
					question.question
				}</p>`

				question.options.forEach(option => {
					const label = document.createElement('label')
					const input = document.createElement('input')
					input.type = 'radio'
					input.name = `question${index}`
					input.value = option
					label.appendChild(input)
					label.appendChild(document.createTextNode(option))
					label.appendChild(document.createElement('br'))
					questionContainer.appendChild(label)
				})

				const selectedOption = document.querySelector(
					`input[name=question${index}]:checked`
				)
				if (selectedOption) {
					if (
						Array.isArray(question.correct)
							? question.correct.includes(selectedOption.value)
							: question.correct === selectedOption.value
					) {
						selectedOption.parentElement.style.color = 'green'
					} else {
						selectedOption.parentElement.style.color = 'red'
					}
				}
			}

			function updateNavigation() {
				prevBtn.disabled = currentQuestionIndex === 0
				nextBtn.disabled = currentQuestionIndex === shuffledQuestions.length - 1
			}

			function showResults() {
				resultsTable.innerHTML = ''
				shuffledQuestions.forEach((q, index) => {
					const userAnswer = userAnswers[index]
					const isCorrect = Array.isArray(q.correct)
						? q.correct.includes(userAnswer)
						: q.correct === userAnswer
					const row = document.createElement('tr')
					row.innerHTML = `
											<td>${index + 1}</td>
											<td>${userAnswer || 'Не отвечено'}</td>
											<td>${Array.isArray(q.correct) ? q.correct.join(', ') : q.correct}</td>
											<td>${isCorrect ? 'Правильно' : 'Неправильно'}</td>
									`
					resultsTable.appendChild(row)
				})
				resultsContainer.style.display = 'block'
				questionContainer.style.display = 'none'
				document.getElementById('navigation').style.display = 'none'
				document.getElementById('controls').style.display = 'none'
			}

			shuffleBtn.addEventListener('click', initializeTest)

			showResultsBtn.addEventListener('click', showResults)

			prevBtn.addEventListener('click', () => {
				if (currentQuestionIndex > 0) {
					userAnswers[currentQuestionIndex] = document.querySelector(
						`input[name=question${currentQuestionIndex}]:checked`
					)?.value
					currentQuestionIndex--
					showQuestion(currentQuestionIndex)
					updateNavigation()
				}
			})

			nextBtn.addEventListener('click', () => {
				if (currentQuestionIndex < shuffledQuestions.length - 1) {
					userAnswers[currentQuestionIndex] = document.querySelector(
						`input[name=question${currentQuestionIndex}]:checked`
					)?.value
					currentQuestionIndex++
					showQuestion(currentQuestionIndex)
					updateNavigation()
				} else {
					userAnswers[currentQuestionIndex] = document.querySelector(
						`input[name=question${currentQuestionIndex}]:checked`
					)?.value
				}
			})

			questionContainer.addEventListener('change', event => {
				const selectedOption = event.target
				if (
					Array.isArray(shuffledQuestions[currentQuestionIndex].correct)
						? shuffledQuestions[currentQuestionIndex].correct.includes(
								selectedOption.value
						  )
						: selectedOption.value ===
						  shuffledQuestions[currentQuestionIndex].correct
				) {
					selectedOption.parentElement.style.color = 'green'
				} else {
					selectedOption.parentElement.style.color = 'red'
				}
			})

			initializeTest()
		})
})
