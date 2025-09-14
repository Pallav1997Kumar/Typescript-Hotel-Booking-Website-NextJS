"use client"
import React, { useState } from "react";

export default function ContactUsForm(){

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [number, setNumber] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    function sumbitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return(
        <React.Fragment>
            <h1 className="text-red-600 text-3xl font-bold mb-4">Get in touch</h1>

            <form onSubmit={sumbitForm}>
                
                <label className="block text-orange-600 font-bold mb-2" htmlFor="name">
                    <div className="flex mb-4">
                        <div className="w-1/4">Name: </div>   
                        <div className="w-3/4">
                            <input 
                                type="text" 
                                value={name} 
                                id="name" 
                                onChange={(event)=> setName(event.target.value)}
                                placeholder="Enter Name" 
                                className="text-black border-b-2 border-orange-500 focus:outline-none focus:border-orange-700 w-3/4"
                            />
                        </div>
                    </div>
                </label>
                
                <label className="block text-orange-600 font-bold mb-2" htmlFor="email">
                    <div className="flex mb-4">
                        <div className="w-1/4">Email: </div>
                        <div className="w-3/4">
                            <input 
                                type="email" 
                                value={email} 
                                id="email" 
                                onChange={(event)=> setEmail(event.target.value)}
                                placeholder="Enter Email" 
                                className="text-black border-b-2 border-orange-500 focus:outline-none focus:border-orange-700 w-3/4"
                            />
                        </div>
                    </div>
                </label>
                
                <label className="block text-orange-600 font-bold mb-2" htmlFor="mobile-no">
                    <div className="flex mb-4">
                        <div className="w-1/4">Mobile Number: </div>
                        <div className="w-3/4">
                            <input 
                                type="number" 
                                value={number} 
                                id="mobile-no" 
                                onChange={(event)=> setNumber(event.target.value)}
                                placeholder="Enter Your Number" 
                                className="text-black border-b-2 border-orange-500 focus:outline-none focus:border-orange-700 w-3/4"
                            />
                        </div>
                    </div>
                </label>                

                <label className="block text-orange-600 font-bold mb-2" htmlFor="subject">
                    <div className="flex mb-4">
                        <div className="w-1/4">Subject: </div>
                        <div className="w-3/4">
                            <input 
                                type="text" 
                                value={subject} 
                                id="subject" 
                                onChange={(event)=> setSubject(event.target.value)}
                                placeholder="Enter Subject" 
                                className="text-black border-b-2 border-orange-500 focus:outline-none focus:border-orange-700 w-3/4"
                            />
                        </div>
                    </div>
                </label>

                <label className="block text-orange-600 font-bold mb-2" htmlFor="message">
                    Message:
                    <textarea 
                        value={message} 
                        id="message" 
                        rows={5} 
                        cols={75}
                        onChange={(event)=> setMessage(event.target.value)}
                        placeholder="Enter Message" 
                        className="text-black border-b-2 border-orange-500 focus:outline-none focus:border-orange-700 w-full"
                    />
                </label>
                <div className="flex justify-center mt-4">
                    <button 
                        type="submit" 
                        className="bg-orange-500 text-white font-bold py-2 px-6 rounded hover:bg-orange-600"
                    >
                        SUBMIT
                    </button>
                </div>
            </form>

        </React.Fragment>
    )
}