import { IconGames, IconHome, IconLearn, IconLibrary, IconProfile } from './components/Icons';
import { I18nProvider, useI18n } from './i18n/I18n';
import { ProgressProvider, useProgress } from './progress/Progress';
import { href, useRoute, type Route } from './router';
import { CombinationGame, GamesHub, GuessGame, MemoryGame, TrueFalseGame } from './screens/Games';
import { Home } from './screens/Home';
import { LessonList, LessonView } from './screens/Learn';
import { CardDetail, Library } from './screens/Library';
import { Profile } from './screens/Profile';
import { Sources } from './screens/Sources';

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case 'home': return <Home />;
    case 'learn': return <LessonList />;
    case 'lesson': return <LessonView id={route.id} />;
    case 'library': return <Library />;
    case 'card': return <CardDetail id={route.id} />;
    case 'games': return <GamesHub />;
    case 'game':
      if (route.id === 'guess') return <GuessGame />;
      if (route.id === 'truefalse') return <TrueFalseGame />;
      if (route.id === 'combination') return <CombinationGame />;
      return <MemoryGame />;
    case 'profile': return <Profile />;
    case 'sources': return <Sources />;
  }
}

function section(route: Route): string {
  switch (route.name) {
    case 'learn': case 'lesson': case 'sources': return 'learn';
    case 'library': case 'card': return 'library';
    case 'games': case 'game': return 'games';
    case 'profile': return 'profile';
    default: return 'home';
  }
}

function Shell() {
  const route = useRoute();
  const { t } = useI18n();
  const { toast } = useProgress();
  const current = section(route);
  const items = [
    { id: 'home', href: href.home(), label: t('nav.home'), icon: <IconHome /> },
    { id: 'learn', href: href.learn(), label: t('nav.learn'), icon: <IconLearn /> },
    { id: 'library', href: href.library(), label: t('nav.library'), icon: <IconLibrary /> },
    { id: 'games', href: href.games(), label: t('nav.games'), icon: <IconGames /> },
    { id: 'profile', href: href.profile(), label: t('nav.profile'), icon: <IconProfile /> },
  ];

  return (
    <div className="app">
      <main id="main" className="main">
        <Screen route={route} />
      </main>
      {toast && <div className="toast fade" role="status">{toast}</div>}
      <nav className="nav" aria-label="Arkhé">
        {items.map((it) => (
          <a key={it.id} href={it.href} aria-current={current === it.id ? 'page' : undefined}>
            {it.icon}
            {it.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <ProgressProvider>
        <Shell />
      </ProgressProvider>
    </I18nProvider>
  );
}
