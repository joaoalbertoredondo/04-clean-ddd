import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-is'

let inMemoryAnswesRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswesRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswesRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswesRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-1',
      content: 'Novo conteúdo',
    })

    expect(inMemoryAnswesRepository.items[0]).toMatchObject({
      content: 'Novo conteúdo',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswesRepository.create(newAnswer)

    await expect(() => {
      return sut.execute({
        answerId: newAnswer.id.toValue(),
        authorId: 'author-2',
        content: 'Conteúdo teste',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
