import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import logoSvg from '@/assets/logo.svg';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import GiveDelivery from '@/assets/illustrations/give-deliveries.svg';

interface MenuItem {
  titleKey: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  mobileExtraLinks?: {
    nameKey: string;
    url: string;
  }[];
  auth?: {
    register: {
      textKey: string;
      url: string;
    };
    login: {
      textKey: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: '/',
    src: logoSvg,
    alt: 'logo',
    title: 'EcoDeli',
  },
  menu = [
    {
      titleKey: 'client.components.navbar.livraison.titre',
      url: '/',
      items: [
        {
          titleKey: 'client.components.navbar.livraison.trouverLivraison',
          description: 'client.components.navbar.livraison.trouverLivraisonDescription',
          url: '/deliveries',
        },
        {
          titleKey: 'client.components.navbar.livraison.devenirLivreur',
          description: 'client.components.navbar.livraison.devenirLivreurDescription',
          url: '/become-deliveryman',
        },

      ],
    },
    {
      titleKey: 'client.components.navbar.prestation.titre',
      url: '#',
      items: [
        {
          titleKey: 'client.components.navbar.prestation.trouverPrestations',
          description: 'client.components.navbar.prestation.trouverPrestationsDescription',
          url: '/services',
        },
        {
          titleKey: 'client.components.navbar.prestation.devenirPrestataire',
          description: 'client.components.navbar.prestation.devenirPrestataireDescription',
          url: '/become-provider',
        }
      ],
    },
    {
      titleKey: 'client.components.navbar.qui_sommes_nous',
      url: '/our-teams',
    },
  ],
  auth = {
    register: { textKey: 'client.components.navbar.register', url: '/auth/register' },
    login: { textKey: 'client.components.navbar.login', url: '/auth/login' },
  },
}: NavbarProps) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  return (
    <section className='py-4 h-16'>
      <div className='container'>
        <nav className='hidden justify-between lg:flex'>
          <div className='flex items-center gap-6'>
            <Link to={logo.url} className='flex items-center gap-2'>
              <img src={logo.src} className='w-8' alt={logo.alt} />
              <span className='text-lg font-semibold'>{logo.title}</span>
            </Link>
            <div className='flex items-center'>
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item, index) =>
                    index === 0 ? renderMenuItemWithImage(item, t) : renderMenuItem(item, t)
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className='flex gap-2'>
          <Button variant="outline" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
            {user?.user_id ? (
              <Button asChild size='sm'>
                <Link to="/office/dashboard">
                  {t('client.components.navbar.goToDashboard') || 'Accéder à mon compte'}
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild className='w-full' variant='link'>
                  <Link to={auth.register.url}>{t(auth.register.textKey)}</Link>
                </Button>
                <Button asChild size='sm'>
                  <Link to={auth.login.url}>{t(auth.login.textKey)}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        <div className='block lg:hidden'>
          <div className='flex items-center justify-between'>
            <Link to={logo.url} className='flex items-center gap-2'>
              <img src={logo.src} className='w-8' alt={logo.alt} />
              <span className='text-lg font-semibold'>{logo.title}</span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon'>
                  <Menu className='size-4' />
                </Button>
              </SheetTrigger>
              <SheetContent className='overflow-y-auto mr-5'>
                <SheetHeader>
                  <SheetTitle>
                    <Link to={logo.url} className='flex items-center gap-2'>
                      <img src={logo.src} className='w-8' alt={logo.alt} />
                      <span className='text-lg font-semibold'>{logo.title}</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className='my-6 flex flex-col gap-4'>
                  <Accordion
                    type='single'
                    collapsible
                    className='flex w-full flex-col gap-2'
                  >
                    {menu.map((item) => renderMobileMenuItem(item, t))}
                  </Accordion>

                  <div className='flex flex-col gap-2 mt-4'>
                    {user?.user_id ? (
                      <Button asChild className='w-full'>
                        <Link to="/office/dashboard">
                          {t('client.components.navbar.goToDashboard') || 'Accéder à mon compte'}
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild className='w-full' variant='link'>
                          <Link to={auth.register.url}>{t(auth.register.textKey)}</Link>
                        </Button>
                        <Button asChild className='w-full'>
                          <Link to={auth.login.url}>{t(auth.login.textKey)}</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem, t: any) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.titleKey} className='text-muted-foreground'>
        <NavigationMenuTrigger>{t(item.titleKey)}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className='w-80 p-3'>
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.titleKey}>
                  <Link
                    to={subItem.url}
                    className='flex select-none gap-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground'
                  >
                    {subItem.icon}
                    <div>
                      <div className='text-sm font-semibold'>
                        {t(subItem.titleKey)}
                      </div>
                      {subItem.description && (
                        <p className='text-sm leading-snug text-muted-foreground'>
                          {t(subItem.description)}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <Link
      key={item.titleKey}
      to={item.url}
      className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground'
    >
      {t(item.titleKey)}
    </Link>
  );
};

const renderMenuItemWithImage = (item: MenuItem, t: any) => {


  return (
    <NavigationMenuItem key={item.titleKey} className='text-muted-foreground'>
      <NavigationMenuTrigger>{t(item.titleKey)}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
          <li className='row-span-3'>
            <NavigationMenuLink asChild>
              <Link
                to='/'
                className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted no-underline outline-none focus:shadow-md'
              >
                <img
                  src={GiveDelivery}
                  alt={t(item.titleKey)}
                  className='h-48 w-48 rounded-md object-cover'
                />
              </Link>
            </NavigationMenuLink>
          </li>
          {item.items?.map((subItem) => (
            <ListItem key={subItem.titleKey} to={subItem.url} title={t(subItem.titleKey)}>
              {t(subItem.description)}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, t: any) => {
  if (item.items) {
    return (
      <AccordionItem key={item.titleKey} value={item.titleKey} className='border-b-0'>
        <AccordionTrigger className='py-2 font-semibold hover:no-underline'>
          {t(item.titleKey)}
        </AccordionTrigger>
        <AccordionContent className='mt-2'>
          {item.items.map((subItem) => (
            <Link
              key={subItem.titleKey}
              to={subItem.url}
              className='flex select-none gap-2 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground'
            >
              {subItem.icon}
              <div>
                <div className='text-sm font-semibold'>{t(subItem.titleKey)}</div>
                {subItem.description && (
                  <p className='text-sm leading-snug text-muted-foreground'>
                    {t(subItem.description)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.titleKey} to={item.url} className='font-semibold'>
      {t(item.titleKey)}
    </Link>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  LinkProps & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default Navbar;
