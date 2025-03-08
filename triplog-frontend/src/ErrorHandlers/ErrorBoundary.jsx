import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-red-100 text-red-800 rounded">
                    <h2 className="text-xl font-bold">🚨 Something went wrong</h2>
                    <p>We couldn't load the map. Please try again later.</p>
                </div>
            );
        }
        return this.props.children;
    }
}
