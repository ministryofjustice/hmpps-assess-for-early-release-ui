document.addEventListener('DOMContentLoaded', () => {
  const nextQuestionLink = document.querySelector('#next-question-link')
  if (!nextQuestionLink) {
    return
  }

  function handleSaveAndGotoNxtQuestion() {
    document.querySelector('#saveType').value = 'nextQuestion'
    document.querySelector('#eligibility-question-form').submit()
  }

  nextQuestionLink.addEventListener('click', handleSaveAndGotoNxtQuestion)
})
