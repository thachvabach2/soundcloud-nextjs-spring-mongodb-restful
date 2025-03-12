package vn.bachdao.soundcloud.service;

import org.springframework.stereotype.Service;

import vn.bachdao.soundcloud.domain.Author;
import vn.bachdao.soundcloud.repository.AuthorRepository;

@Service
public class AuthorService {
    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public Author createAuthor(Author author) {
        return authorRepository.save(author);
    }
}
