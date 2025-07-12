package vn.bachdao.soundcloud.web.rest.admin;

import java.util.Optional;

import org.bson.Document;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.client.result.DeleteResult;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResUpdateResultDTO;
import vn.bachdao.soundcloud.domain.dto.response.user.ResCreateUserDTO;
import vn.bachdao.soundcloud.domain.dto.response.user.ResGetUserDTO;
import vn.bachdao.soundcloud.service.UserService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.util.mapper.UserMapper;
import vn.bachdao.soundcloud.web.rest.errors.EmailAlreadyUsedException;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;
import vn.bachdao.soundcloud.web.rest.errors.UsernameAlreadyUsedException;

@RestController
@RequestMapping("/api/v1")
public class UserAdminResource {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserAdminResource(UserService userService,
            PasswordEncoder passwordEncoder,
            UserMapper userMapper) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @PostMapping("/users")
    @ApiMessage("Create a user")
    public ResponseEntity<ResCreateUserDTO> createUser(@Valid @RequestBody User user)
            throws UsernameAlreadyUsedException {
        Optional<User> DbUser = this.userService.getUserByUsername(user.getUsername());
        if (DbUser.isPresent()) {
            throw new UsernameAlreadyUsedException("User với username = " + user.getUsername() + " đã tồn tại");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        ResCreateUserDTO resCreateUserDTO = this.userMapper.toResCreateUserDTO(this.userService.createUser(user));
        return ResponseEntity.status(HttpStatus.CREATED).body(resCreateUserDTO);
    }

    @GetMapping("/users/{id}")
    @ApiMessage("Get user by Id")
    public ResponseEntity<ResGetUserDTO> getAUser(@PathVariable("id") String id) throws IdInvalidException {
        Optional<User> userOptional = this.userService.getUserById(id);

        if (userOptional.isEmpty()) {
            throw new IdInvalidException("User với Id = " + id + " không tồn tại");
        }

        ResGetUserDTO res = this.userMapper.toResGetUserDTO(userOptional.get());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/users")
    @ApiMessage("Get all user with pagination")
    public ResponseEntity<ResPaginationDTO> getAllUsers(
            @Filter(entityClass = User.class) Document document,
            Pageable pageable) {

        return ResponseEntity.ok(this.userService.getAllUser(document, pageable));
    }

    @PatchMapping("/users")
    @ApiMessage("Update a user")
    public ResponseEntity<ResUpdateResultDTO> updateAUser(@RequestBody User reqUser)
            throws IdInvalidException, EmailAlreadyUsedException {
        Optional<User> currentUserOptional = this.userService.getUserById(reqUser.getId());

        // check exist id
        if (currentUserOptional.isEmpty()) {
            throw new IdInvalidException("User với Id = " + reqUser.getId() + " không tồn tại");
        }

        ResUpdateResultDTO updateUserDTO = this.userService.updateAUser(reqUser);
        return ResponseEntity.ok().body(updateUserDTO);
    }

    @DeleteMapping("/users/{id}")
    @ApiMessage("Delete user by Id")
    public ResponseEntity<DeleteResult> deleteAUser(@PathVariable("id") String id) throws IdInvalidException {
        Optional<User> userOptional = this.userService.getUserById(id);
        if (userOptional.isEmpty()) {
            throw new IdInvalidException("User với Id = " + id + " không tồn tại");
        }

        return ResponseEntity.ok(this.userService.deleteAUser(id));
    }
}