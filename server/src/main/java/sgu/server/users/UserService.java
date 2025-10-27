package sgu.server.users;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sgu.server.utils.ApiResponse;

import java.util.Optional;

@Service
@Transactional
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ResponseEntity<ApiResponse> save(User user) {
        if (repository.findByEmail(user.getEmail()).isPresent()) {
            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.BAD_REQUEST, true, "El correo ya está registrado"),
                    HttpStatus.BAD_REQUEST
            );
        }
        repository.save(user);
        return new ResponseEntity<>(
                new ApiResponse(user, HttpStatus.CREATED),
                HttpStatus.CREATED
        );
    }

    @Transactional
    public ResponseEntity<ApiResponse> update(User user) {
        if (user.getId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(HttpStatus.BAD_REQUEST,  true, "El ID del usuario es requerido para actualizar."));
        }

        Optional<User> existing = repository.findById(user.getId());

        if (existing.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado"),
                    HttpStatus.NOT_FOUND
            );
        }

        User userX = existing.get();

        if (!user.getEmail().equals(userX.getEmail())) {
            if (repository.existsByEmail(user.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiResponse(HttpStatus.CONFLICT,true, "Usuario con este email ya existe"));
            }
        }

        userX.setFirstName(user.getFirstName());
        userX.setSecondName(user.getSecondName());
        userX.setLastName1(user.getLastName1());
        userX.setLastName2(user.getLastName2());
        userX.setEmail(user.getEmail());
        userX.setPhoneNumber(user.getPhoneNumber());
        repository.save(userX);

        return new ResponseEntity<>(
                new ApiResponse(existing, HttpStatus.OK),
                HttpStatus.OK
        );
    }

    @Transactional
    public ResponseEntity<ApiResponse> delete(Long id) {
        Optional<User> existing = repository.findById(id);
        if (existing.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado"),
                    HttpStatus.NOT_FOUND
            );
        }
        repository.deleteById(id);
        return new ResponseEntity<>(
                new ApiResponse(HttpStatus.OK, false, "Usuario eliminado correctamente"),
                HttpStatus.OK
        );
    }

    @Transactional
    public ResponseEntity<ApiResponse> findAll() {
        return new ResponseEntity<>(
                new ApiResponse(repository.findAll(), HttpStatus.OK),
                HttpStatus.OK
        );
    }

    @Transactional
    public ResponseEntity<ApiResponse> findById(Long id) {
        Optional<User> user = repository.findById(id);
        if (user.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado"),
                    HttpStatus.NOT_FOUND
            );
        }
        return new ResponseEntity<>(
                new ApiResponse(user, HttpStatus.OK),
                HttpStatus.OK
        );
    }
}
