const sampleEvents = [
  {
    id: 'evt-1',
    type: 'Exam',
    title: 'Exam Title',
    module: 'Exam Module',
    date: '2026-02-26',
    time: '09:00',
    info: 'Short event info goes here.',
    additional: 'Additional details show up in the expanded panel.'
  },
  {
    id: 'evt-2',
    type: 'Deadline',
    title: 'Coursework Deadline',
    module: 'Module Name',
    date: '2026-03-05',
    time: '23:59',
    info: 'Submit the coursework on the portal before the cutoff.',
    additional: 'Consider adding checklist items, rubric notes, and submission links.'
  },
  {
    id: 'evt-3',
    type: 'Exam',
    title: 'Exam Title',
    module: 'Exam Module',
    date: '2026-03-08',
    time: '14:00',
    info: 'Short event info goes here.',
    additional: 'Room number, allowed materials, and seating plan can be shown here.'
  }
]

const getUpcomingEventsPage = (req, res) => {
  res.render('UpcomingEvents', {
    eventsJson: JSON.stringify(sampleEvents)
  })
}

module.exports = {
  getUpcomingEventsPage,
  sampleEvents
}
