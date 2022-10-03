import MainNavigation from './MainNavigation';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <MainNavigation />
      {children}
    </>
  );
};

export default Layout;
