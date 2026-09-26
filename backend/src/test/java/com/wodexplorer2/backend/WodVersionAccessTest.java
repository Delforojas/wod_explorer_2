package com.wodexplorer2.backend;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodType;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.exception.UnauthorizedException;
import com.wodexplorer2.backend.repository.WodRepository;
import com.wodexplorer2.backend.repository.WodVersionRepository;
import com.wodexplorer2.backend.service.CurrentUserService;
import com.wodexplorer2.backend.service.WodVersionService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WodVersionAccessTest {

  @Mock
  private WodVersionRepository wodVersionRepository;

  @Mock
  private WodRepository wodRepository;

  @Mock
  private CurrentUserService currentUserService;

  private WodVersionService wodVersionService;

  @BeforeEach
  void setUp() {
    wodVersionService = new WodVersionService(
        wodVersionRepository,
        wodRepository,
        currentUserService);
  }

  @Test
  void privateVersionRequiresAuthentication() {
    User owner = user();
    Wod wod = new Wod(owner, "Privado", WodOrigin.PERSONAL);
    WodVersion version = version(wod);
    when(wodVersionRepository.findById(1L)).thenReturn(Optional.of(version));
    when(currentUserService.find()).thenReturn(Optional.empty());

    assertThrows(UnauthorizedException.class, () -> wodVersionService.findById(1L));
  }

  @Test
  void archivedPersonalVersionIsNotVisibleToItsOwner() {
    User owner = user();
    Wod wod = new Wod(owner, "Archivado", WodOrigin.PERSONAL);
    wod.archive();
    WodVersion version = version(wod);
    when(wodVersionRepository.findById(1L)).thenReturn(Optional.of(version));
    when(currentUserService.find()).thenReturn(Optional.of(owner));

    assertThrows(ForbiddenException.class, () -> wodVersionService.findById(1L));
  }

  private WodVersion version(Wod wod) {
    return new WodVersion(wod, 1, WodType.FOR_TIME, null, null);
  }

  private User user() {
    return mock(User.class);
  }
}
