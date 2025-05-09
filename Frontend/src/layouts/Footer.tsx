const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12 border-t border-gray-800 text-center">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} Evently. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
