import express from 'express'
import nodemailer from 'nodemailer'
import { PrismaFeedbacksRepository } from './repositories/prisma/prisma-feedbacks-repository'
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case'

export const routes = express.Router()

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'cdf4563435318c',
    pass: '6a60bca7a2da9f',
  },
})

routes.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body

  const prismaFeedbacksRepository = new PrismaFeedbacksRepository()
  const submitFeedbackUseCase = new SubmitFeedbackUseCase(
    prismaFeedbacksRepository
  )

  await submitFeedbackUseCase.execute({ type, comment, screenshot })

  // await transport.sendMail({
  //   from: 'Equipe Feedget <oi@feedget.com>',
  //   to: 'Mateus Felipe <mateusfelipefg77@gmail.com>',
  //   subject: 'Novo feedback',
  //   html: [
  //     `<div style="font-family: sans-serif; font-size: 16px; color: #333;">`,
  //     `<p>Tipo do feedback: <spam style="color: #000">${type}</spam></p>`,
  //     `<p>Comentário: <spam style="color: #000">${comment}</spam></p>`,
  //     `</div>`,
  //   ].join('\n'),
  // })

  return res.status(201).send()
})
