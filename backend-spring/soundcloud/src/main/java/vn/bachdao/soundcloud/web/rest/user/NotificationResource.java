package vn.bachdao.soundcloud.web.rest.user;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.service.NotificationService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

@RestController
@RequestMapping("/api/v1")
public class NotificationResource {

    private final NotificationService notificationService;

    public NotificationResource(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/notifications")
    @ApiMessage("Get all notifications by a user with pagination")
    public ResponseEntity<ResPaginationDTO> getNotificationsByAUserWithPagination(Pageable pageable)
            throws UserNotAuthenticatedException {
        return ResponseEntity.ok(this.notificationService.getNotificationsByAUserWithPagination(pageable));
    }
}
