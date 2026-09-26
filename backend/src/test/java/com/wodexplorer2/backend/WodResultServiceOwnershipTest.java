package com.wodexplorer2.backend;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.WodResult;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.mapper.WodResultMapper;
import com.wodexplorer2.backend.repository.WodResultRepository;
import com.wodexplorer2.backend.repository.WodVersionItemRepository;
import com.wodexplorer2.backend.repository.WodVersionRepository;
import com.wodexplorer2.backend.service.CurrentUserService;
import com.wodexplorer2.backend.service.WodResultService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WodResultServiceOwnershipTest {

  @Mock
  private WodResultRepository wodResultRepository;

  @Mock
  private WodVersionRepository wodVersionRepository;

  @Mock
  private WodVersionItemRepository wodVersionItemRepository;

  @Mock
  private WodResultMapper wodResultMapper;

  @Mock
  private CurrentUserService currentUserService;

  private WodResultService wodResultService;

  @BeforeEach
  void setUp() {
    wodResultService = new WodResultService(
        wodResultRepository,
        wodVersionRepository,
        wodVersionItemRepository,
        wodResultMapper,
        currentUserService);
  }

  @Test
  void rejectsReadingAnotherUsersResult() {
    User currentUser = user(7L);
    User otherUser = user(8L);
    WodResult result = mock(WodResult.class);
    when(currentUserService.require()).thenReturn(currentUser);
    when(wodResultRepository.findById(1L)).thenReturn(Optional.of(result));
    when(result.getUser()).thenReturn(otherUser);

    assertThrows(ForbiddenException.class, () -> wodResultService.findById(1L));
  }

  private User user(Long id) {
    User user = mock(User.class);
    when(user.getId()).thenReturn(id);
    return user;
  }
}
