import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Product from "../components/products";

export default function Products() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Product />
            </main>
            <Footer />
        </div>
    );
}
