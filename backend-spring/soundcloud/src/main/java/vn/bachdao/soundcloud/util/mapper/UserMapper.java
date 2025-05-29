package vn.bachdao.soundcloud.util.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.response.user.ResCreateUserDTO;
import vn.bachdao.soundcloud.domain.dto.response.user.ResGetUserDTO;

@Mapper(componentModel = "spring", uses = {})
public interface UserMapper {
    ResCreateUserDTO toResCreateUserDTO(User user);

    ResGetUserDTO toResGetUserDTO(User user);

    List<ResGetUserDTO> toResGetUserDTOs(List<User> users);
}
