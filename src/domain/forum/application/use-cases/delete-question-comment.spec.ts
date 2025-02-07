import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-is'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Comment On Question', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionCommet = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(questionCommet)

    await sut.execute({
      questionCommentId: questionCommet.id.toString(),
      authorId: questionCommet.authorId.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const questionCommet = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryQuestionCommentsRepository.create(questionCommet)

    expect(() => {
      return sut.execute({
        questionCommentId: questionCommet.id.toString(),
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
