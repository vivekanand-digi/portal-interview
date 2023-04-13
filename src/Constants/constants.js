export const microsoftLoginPath =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNDgiIGhlaWdodD0iNDgiCnZpZXdCb3g9IjAgMCA0OCA0OCIKc3R5bGU9IiBmaWxsOiMwMDAwMDA7Ij48cGF0aCBmaWxsPSIjZmY1NzIyIiBkPSJNNiA2SDIyVjIySDZ6IiB0cmFuc2Zvcm09InJvdGF0ZSgtMTgwIDE0IDE0KSI+PC9wYXRoPjxwYXRoIGZpbGw9IiM0Y2FmNTAiIGQ9Ik0yNiA2SDQyVjIySDI2eiIgdHJhbnNmb3JtPSJyb3RhdGUoLTE4MCAzNCAxNCkiPjwvcGF0aD48cGF0aCBmaWxsPSIjZmZjMTA3IiBkPSJNMjYgMjZINDJWNDJIMjZ6IiB0cmFuc2Zvcm09InJvdGF0ZSgtMTgwIDM0IDM0KSI+PC9wYXRoPjxwYXRoIGZpbGw9IiMwM2E5ZjQiIGQ9Ik02IDI2SDIyVjQySDZ6IiB0cmFuc2Zvcm09InJvdGF0ZSgtMTgwIDE0IDM0KSI+PC9wYXRoPjwvc3ZnPg=='
export const Auth = {
  authority: 'https://login.microsoftonline.com/digisprint.com',
  clientId: 'ba6f6865-88a9-43b7-ac2b-b002b3168225'
}

export const stepStatus = {
  Applied: 'finish ',
  NotShortListed: 'error',
  NotSelectedRound1: 'error',
  NotSelectedRound2: 'error',
  RejectedOffer: 'error',
  NotOffered: 'error',
  Absconded: 'error',
  NotJoined: 'error',
  AdminReject: 'error'
}
export const UpcomingStatusTitle = {
  Applied: 'Waiting for selection',
  ShortListed: 'Waiting to Schedule round 1',
  ScheduleRound1: 'Awaiting for round 1 feedback',
  SelectedRound1: 'Waiting to schedule round 2',
  RescheduleRound1: 'Awaiting for round 1 feedback',
  ScheduleRound2: 'Awaiting for round 2 feedback',
  RescheduleRound2: 'Awaiting for round 2 feedback',
  SelectedRound2: 'Waiting to schedule HR round',
  NotShortListed: 'Not Shortlisted',
  NotSelectedRound1: 'Not selected in round 1',
  ScheduledHr: 'Awaiting for HR Feedback',
  RescheduledHr: 'Awaiting for HR Feedback',
  Offered: 'Awaiting to accept/reject offer',
  NotSelectedRound2: 'Not selected in Round 2',
  RejectedOffer: 'Rejected Offer',
  NotOffered: 'Not Offered',
  AcceptedOffer: 'Waiting to Join',
  Joined: 'Joined',
  OfferDeclined: 'Offer Declined',
  NotJoined: 'Not Joined',
  Absconded: 'Absconded',
  ReEvaluateRound1:"Waiting to Reschedule Round 1",
  ReEvaluateRound2:"Waiting to Reschedule Round 2",
  ReEvaluateRoundHr:"Waiting to Reschedule Round HR"
}

export const HistoryStatusTitle = {
  Applied: 'Applied',
  ShortListed: 'ShortListed',
  ScheduleRound1: 'Scheduled Round 1',
  RescheduleRound1: 'Rescheduled Round 1',
  SelectedRound1: 'Selected Round 1',
  ScheduleRound2: 'Scheduled Round 2',
  RescheduleRound2: 'Rescheduled Round 2',
  SelectedRound2: 'Selected Round 2',
  NotShortListed: 'Not Shortlisted',
  NotSelectedRound1: 'Not selected in round 1',
  ScheduledHr: 'Scheduled HR Round',
  RescheduleHr: 'Rescheduled HR Round',
  Offered: 'Offered',
  NotSelectedRound2: 'Not selected in Round 2',
  RejectedOffer: 'Rejected Offer',
  NotOffered: 'Not Offered',
  AcceptedOffer: 'Accepted Offer',
  Joined: 'Joined',
  OfferDeclined: 'Offer Declined',
  NotJoined: 'Not Joined',
  Absconded: 'Absconded',
  ReEvaluateRound1:"Re-Evaluate Round 1",
  ReEvaluateRound2:"Re-Evaluate Round 2",
  ReEvaluateRoundHr:"Re-Evaluate Round HR"
}
