package vn.bachdao.soundcloud.web.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.client.result.DeleteResult;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.service.UserService;
import vn.bachdao.soundcloud.util.errors.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
public class UserResource {

    private final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.createUser(user));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getAUser(@PathVariable("id") String id) throws IdInvalidException {
        Optional<User> userOptional = this.userService.getUserById(id);

        if (userOptional.isEmpty()) {
            throw new IdInvalidException("User với Id = " + id + " không tồn tại");
        }

        return ResponseEntity.ok(userOptional.get());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(this.userService.getAllUser());
    }

    @PutMapping("/users")
    public ResponseEntity<User> updateAUser(@RequestBody User reqUser) {
        Optional<User> currentUserOptional = this.userService.getUserById(reqUser.getId());
        User updatedUser = this.userService.updateAUser(reqUser, currentUserOptional.get());
        return ResponseEntity.status(HttpStatus.CREATED).body(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<DeleteResult> deleteAUser(@PathVariable("id") String id) throws IdInvalidException {
        Optional<User> userOptional = this.userService.getUserById(id);
        if (userOptional.isEmpty()) {
            throw new IdInvalidException("User với Id = " + id + " không tồn tại");
        }

        return ResponseEntity.ok(this.userService.deleteAUser(id));
    }
}