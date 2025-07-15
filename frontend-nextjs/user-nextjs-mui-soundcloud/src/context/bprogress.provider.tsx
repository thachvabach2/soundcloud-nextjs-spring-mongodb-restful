'use client';

import { ProgressProvider as ProgressBar } from '@bprogress/next/app';

const BProgressProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
            {children}
            <ProgressBar
                height="2px"
                color="#1ed760"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
};

export default BProgressProvider;