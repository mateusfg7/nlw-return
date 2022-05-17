import express from 'express'
import nodemailer from 'nodemailer'
import { prisma } from './prisma'

const app = express()

app.use(express.json())

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'cdf4563435318c',
    pass: '6a60bca7a2da9f',
  },
})

app.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body

  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot,
    },
  })

  await transport.sendMail({
    from: 'Equipe Feedget <oi@feedget.com>',
    to: 'Mateus Felipe <mateusfelipefg77@gmail.com>',
    subject: 'Novo feedback',
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; color: #333;">`,
      `<p>Tipo do feedback: <spam style="color: #000">${type}</spam></p>`,
      `<p>Comentário: <spam style="color: #000">${comment}</spam></p>`,
      `</div>`,
    ].join('\n'),
  })

  return res.status(201).json({
    data: feedback,
  })
})

app.listen(3333, () => {
  console.log('HTTP server running!')
})
