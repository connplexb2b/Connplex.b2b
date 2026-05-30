import React from 'react';

export const metadata = {
    title: 'Gameflix | Connplex Cinemas',
    description: 'Experience the future of gaming with Gameflix by Connplex. Stream, compete, and connect on the next-gen gaming platform.',
};

export default function GameflixLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
