import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to connect some time in the future?</h2>
        <p className="text-gray-500 my-2">Check out my profile so we can connect</p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://www.linkedin.com/in/adhurim-berisha-430046283/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hit me up
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://kinsta.com/wp-content/uploads/2018/09/linkedin-statistics.png" />
      </div>
    </div>
  );
}
