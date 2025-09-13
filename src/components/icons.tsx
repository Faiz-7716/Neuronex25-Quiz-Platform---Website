import type { SVGProps } from "react";

export const Icons = {
  python: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M13.5 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
      <path d="M10.5 14.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
      <path d="M13.2 2.2 10 10.5 13.5 14l3-3.5-2-7Z"/>
      <path d="M10.8 21.8 14 13.5 10.5 10l-3 3.5 2 7Z"/>
    </svg>
  ),
  cpp: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.5 15.5a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"/>
        <path d="M10.5 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8Z"/>
        <path d="M10.5 11v4"/>
        <path d="M18.5 11h-4"/>
        <path d="M16.5 9v4"/>
        <path d="M22.5 11h-4"/>
        <path d="M20.5 9v4"/>
    </svg>
  ),
  java: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M7 11a4.1 4.1 0 0 1-3-5 4.1 4.1 0 0 1 7-2"/>
        <path d="M15 11a4.1 4.1 0 0 1-3-5 4.1 4.1 0 0 1 7-2"/>
        <path d="M11 11h-1"/>
        <path d="M11 18a4 4 0 0 0 4 4h2a4 4 0 0 0 0-8h-6v4Z"/>
        <path d="M4 11c0 2.5 2 4.5 5 4.5h1"/>
        <path d="m4 15.5 8 8"/>
    </svg>
  ),
};
