window.onload = () => {
  document.querySelector('#next-question-link').addEventListener('click', () => {
    document.querySelector('#task-form').submit()
  })
}
