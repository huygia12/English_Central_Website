import React, { HTMLAttributes } from "react";
import { CarouselItem } from "./carousel";
import { NavLink } from "react-router-dom";

interface SlideShowProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  link: string;
}

const slideShow: React.FC<SlideShowProps> = ({ className, ...props }) => {
  return (
    <CarouselItem className="">
      <NavLink to={props.link}>
        <img
          src={props.src}
          alt={props.alt}
          className="h-[27rem] object-fill rounded-xl"
        />
      </NavLink>
    </CarouselItem>
  );
};

export default slideShow;
