import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import FileUpload from "./FileUpload";
import Search from "./Search";

const Header = () => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUpload />
        <form>
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              width={24}
              height={24}
              alt="Logout Button"
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
