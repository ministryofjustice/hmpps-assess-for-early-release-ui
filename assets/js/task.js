window.onload = () => {
  document.querySelector('#next-question-link').addEventListener('click', () => {
    document.querySelector('#saveType').value = 'nextQuestion'
    document.querySelector('#task-form').submit()
  })
}
