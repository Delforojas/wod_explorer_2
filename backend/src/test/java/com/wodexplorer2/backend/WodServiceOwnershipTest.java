package com.wodexplorer2.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.wodexplorer2.backend.dto.WodRequest;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.repository.WodRepository;
import com.wodexplorer2.backend.service.CurrentUserService;
import com.wodexplorer2.backend.service.WodService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WodServiceOwnershipTest {

  @Mock
  private WodRepository wodRepository;

  @Mock
  private CurrentUserService currentUserService;

  private WodService wodService;

  @BeforeEach
  void setUp() {
    wodService = new WodService(wodRepository, currentUserService);
  }

  @Test
  void createsPersonalWodForAuthenticatedUser() {
    User currentUser = mock(User.class);
    when(currentUserService.require()).thenReturn(currentUser);
    when(wodRepository.save(any(Wod.class))).thenAnswer(invocation -> invocation.getArgument(0));

    Wod created = wodService.create(new WodRequest("Mi WOD"));

    assertEquals(currentUser, created.getOwner());
    assertEquals(WodOrigin.PERSONAL, created.getOrigin());
  }

  @Test
  void rejectsUpdatingAnotherUsersWod() {
    User currentUser = user(7L);
    User otherUser = user(8L);
    Wod otherWod = new Wod(otherUser, "Privado", WodOrigin.PERSONAL);
    when(currentUserService.require()).thenReturn(currentUser);
    when(wodRepository.findById(1L)).thenReturn(Optional.of(otherWod));

    assertThrows(
        ForbiddenException.class,
        () -> wodService.update(1L, new WodRequest("No autorizado")));
  }

  private User user(Long id) {
    User user = mock(User.class);
    when(user.getId()).thenReturn(id);
    return user;
  }
}
