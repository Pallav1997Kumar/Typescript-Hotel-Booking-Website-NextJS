'use client'
import React, { MouseEvent } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faSquareXTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import hotelBasicInfo from "@/json objects/hotelBasicInfo";
import { useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";


function FooterFunctionalComponent() {

    const router = useRouter();
    const dispatch = useAppDispatch();

    function loginClickHandler(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        const loginPageCalledFrom = 'Footer';
        const loginRedirectPage = '/profile-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }

    function adminLoginClickHandler(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        const loginPageCalledFrom = 'Footer';
        const loginRedirectPage = '/admin-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/admin-login');
    }

    return (
        <div className="bg-black bg-opacity-80 text-white flex flex-col md:flex-row w-full px-6 py-8">

            {/* Left Section */}
            <div className="md:w-1/3 mb-6 md:mb-0 text-wheat font-semibold font-serif text-lg space-y-4">
                <Image src={'/hotel-logo.jpg'} alt="hotel-logo" width={200} height={175} />
                <p>We make this belief a reality by putting clients first, leading with exceptional ideas, doing the right thing, and giving back.</p>
            </div>

            {/* Contact & Social */}
            <div className="md:w-2/5 mb-6 md:mb-0 px-4">
                <p className="text-cyan-100 text-2xl font-serif font-bold mb-2">Follow Us</p>
                <p className="uppercase text-cyan-100 text-sm mb-4">Social Media Channels</p>
                <ul className="flex flex-wrap gap-4 text-blanchedalmond">
                    <li>
                        <Link href="https://www.facebook.com/">
                            <FontAwesomeIcon icon={faFacebook} /> Facebook
                        </Link>
                    </li>
                    <li>
                        <Link href="https://www.instagram.com/">
                            <FontAwesomeIcon icon={faInstagram} /> Instagram
                        </Link>
                    </li>
                    <li>
                        <Link href="https://twitter.com/">
                            <FontAwesomeIcon icon={faSquareXTwitter} /> Twitter
                        </Link>
                    </li>
                    <li>
                        <Link href="https://in.linkedin.com/">
                            <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                        </Link>
                    </li>
                </ul>

                <p className="text-cyan-100 font-serif text-xl font-bold mt-8 mb-2">Contact Us</p>
                <ul className="space-y-2 text-blanchedalmond">
                    <li>
                        <FontAwesomeIcon icon={faPhone} /> {hotelBasicInfo.contactNo}
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faEnvelope} /> {hotelBasicInfo.emailId}
                    </li>
                </ul>

                <p className="text-cyan-100 font-serif text-xl font-bold mt-8 mb-2">Address</p>
                <ul>
                    <li className="text-blanchedalmond">
                        <FontAwesomeIcon icon={faLocationDot} /> {hotelBasicInfo.address}
                    </li>
                </ul>
            </div>

            {/* Menu */}
            <div className="md:w-1/3 px-4">
                <p className="uppercase text-cyan-300 font-serif text-xl font-bold tracking-wider mb-4">Menu</p>
                <ul className="space-y-2 text-antiquewhite">
                    <li>
                        <Link href="/" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/rooms-suites/" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            Rooms and Suites
                        </Link>
                    </li>
                    <li>
                        <Link href="/dining" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            Dining
                        </Link>
                    </li>
                    <li>
                        <Link href="/meetings-events/" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            Events/ Meeting Rooms
                        </Link>
                    </li>
                    <li>
                        <Link href="/facility-in-our-hotel" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            Facilities
                        </Link>
                    </li>
                    <li>
                        <Link href="/about-us" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact-us" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link onClick={adminLoginClickHandler} href="/admin-login" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            Admin Login
                        </Link>
                    </li>
                    <li>
                        <Link onClick={loginClickHandler} href="/login" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link href="/register" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            Register
                        </Link>
                    </li>
                    <li>
                        <Link href="/cart" className="hover:border-b hover:border-burlywood hover:bg-gray-600 block px-1">
                            My Cart
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}


function Footer(){
    return(
        <ErrorBoundary>
            <FooterFunctionalComponent />
        </ErrorBoundary>
    );
}

export default Footer;