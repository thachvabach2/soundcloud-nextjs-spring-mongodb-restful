package vn.bachdao.soundcloud.web.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.service.UserService;

@RestController
@RequestMapping("/api/v1")
public class UserResource {
    private final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public User createUser(@Valid @RequestBody User user) {
        return this.userService.createUser(user);
    }

    @GetMapping("/users/{id}")
    public User getAUser(@PathVariable("id") String id) {
        Optional<User> userOptional = this.userService.getUserById(id);

        return userOptional.get();
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return this.userService.getAllUser();
    }

    @PutMapping("/users")
    public User updateAUser(@RequestBody User reqUser) {
        Optional<User> currentUserOptional = this.userService.getUserById(reqUser.getId());

        return this.userService.updateAUser(reqUser, currentUserOptional.get());
    }

    @DeleteMapping("/users/{id}")
    public void deleteAUser(@PathVariable("id") String id) {
        this.userService.deleteAUser(id);
    }
}