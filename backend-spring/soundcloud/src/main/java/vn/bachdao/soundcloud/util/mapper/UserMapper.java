package vn.bachdao.soundcloud.util.mapper;

import org.mapstruct.Mapper;

import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.response.user.ResCreateUserDTO;

@Mapper(componentModel = "spring", uses = {})
public interface UserMapper {
    ResCreateUserDTO toResCreateUserDTO(User user);
}
