import React from 'react';

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.421-.668-2.69-1.66-3.612-2.833a7.5 7.5 0 1114.724 0c-.922 1.173-2.191 2.165-3.612 2.833zM9 9.348a3 3 0 013-3v3.348m0-3.348a3 3 0 11-3 3v-3.348z" />
    </svg>
);

export default LightBulbIcon;