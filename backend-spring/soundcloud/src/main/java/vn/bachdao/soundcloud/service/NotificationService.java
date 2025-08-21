package vn.bachdao.soundcloud.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import vn.bachdao.soundcloud.domain.Notification;
import vn.bachdao.soundcloud.repository.NotificationRepository;
import vn.bachdao.soundcloud.service.event.NotificationEvent;

@Service
public class NotificationService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public NotificationService(NotificationRepository notificationRepository,
            SimpMessagingTemplate simpMessagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        try {
            Notification notification = new Notification();
            notification.setType(event.getType());
            notification.setFromUserId(event.getFromUserId());
            notification.setToUserId(event.getToUserId());
            notification.setEntityId(event.getEntityId());

            notificationRepository.insert(notification);

            simpMessagingTemplate.convertAndSendToUser(
                    event.getToUserId(),
                    "/queue/notification",
                    notification);
        } catch (Exception e) {
            LOG.error("Failed to save and send notification for event: {}", event, e);
            // Có thể thêm logic retry hoặc gửi thông báo lỗi đến hệ thống monitoring
        }
    }
}