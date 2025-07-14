import Image from 'next/image'
import Link from 'next/link'


const Footer = () => {
    return (
        <footer className="bg-[#040F28] text-white pt-20 pb-6">
            <div className="container mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <h3 className="text-xl font-semibold text-pink-500 mb-4">About Jismya</h3>
                        <p className="text-gray-400">Premium quality undergarments for the modern woman. Available all over Pakistan!</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-pink-500 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {['About Us', 'Contact', 'Shipping Policy', 'Returns & Exchanges'].map((link) => (
                                <li key={link}>
                                    <Link href={`#${link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-gray-400 hover:text-pink-500 transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-pink-500 mb-4">Contact Us</h3>
                        <p className="text-gray-400">Email: info@jismya.com</p>
                        <p className="text-gray-400">Phone: 03488597922</p>
                        <p className="text-gray-400">Available all over Pakistan</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-pink-500 mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            {['facebook', 'instagram', 'tiktok', 'pinterest'].map((social) => (
                                <Link key={social} href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-2xl">
                                    <i className={`fab fa-${social}`}></i>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-gray-800">
                    <p className="text-gray-400">&copy; 2024 Jismya.com. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer;