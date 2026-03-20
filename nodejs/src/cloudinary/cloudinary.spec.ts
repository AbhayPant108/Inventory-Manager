import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryProvider } from './cloudinary.provider';

describe('CloudinaryProvider', () => {
  let provider: typeof CloudinaryProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryProvider],
    }).compile();

    // provider = module.get<typeof CloudinaryProvider>(CloudinaryProvider);
  });

  it('should be defined', () => {
    // expect(provider).toBeDefined();
  });
});
