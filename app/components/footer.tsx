export default function Footer(){
    return(
        <footer className="bg-gray-800 text-white py-8 text-center">
        <p>📍 Kenyatta University | 📞 +254 712 345 678 | ✉️ support@campusmarket.com</p>
        <p className="mt-4">&copy; {new Date().getFullYear()} Campus Market. All Rights Reserved.</p>
      </footer>
    )
}