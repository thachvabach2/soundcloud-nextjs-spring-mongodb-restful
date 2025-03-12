package vn.bachdao.soundcloud.web.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import vn.bachdao.soundcloud.domain.Author;
import vn.bachdao.soundcloud.service.AuthorService;

@RestController
public class AuthorResource {

    private final AuthorService authorService;

    public AuthorResource(AuthorService authorService) {
        this.authorService = authorService;
    }

    @PostMapping("/author")
    public Author createAuthor(@RequestBody Author author) {
        return authorService.createAuthor(author);
    }

    @GetMapping("/author")
    public String createAuthor() {
        return "haha";
    }
}
