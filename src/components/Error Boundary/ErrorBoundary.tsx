'use client';

import React, { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor (props: ErrorBoundaryProps){
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.log('Error caught by Error Boundary: ', error, errorInfo);
    }

    render(): ReactNode {
        if(this.state.hasError){
            return (
                <div className='text-center text-red-600 p-4'>
                    <h2 className='text-xl font-bold'>
                        Something went wrong !!!
                    </h2>
                    <p>{this.state.error?.message || 'Unknown Error'}</p>
                </div>
            );
        }
        return this.props.children;
    }

}

export default ErrorBoundary

