import { MailAdapter } from '../adapters/mail-adapter'
import { FeedbacksRepository } from '../repositories/feedbacks-repository'

interface SubmitFeedbackUseCaseRequest {
  type: string
  comment: string
  screenshot?: string
}

export class SubmitFeedbackUseCase {
  constructor(
    private feedbacksRepository: FeedbacksRepository,
    private mailAdapter: MailAdapter
  ) {}

  async execute(request: SubmitFeedbackUseCaseRequest) {
    const { type, comment, screenshot } = request

    await this.feedbacksRepository.create({
      type,
      comment,
      screenshot,
    })

    await this.mailAdapter.sendMail({
      subject: 'NOvo Feedback',
      body: [
        `<div style="font-family: sans-serif; font-size: 16px; color: #333;">`,
        `<p>Tipo do feedback: <spam style="color: #000">${type}</spam></p>`,
        `<p>Comentário: <spam style="color: #000">${comment}</spam></p>`,
        `</div>`,
      ].join('\n'),
    })
  }
}
