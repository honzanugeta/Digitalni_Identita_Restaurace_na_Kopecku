export default function MapEmbed() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <iframe
        title="Google Map Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.7968254383472!2d14.037202476608757!3d50.68502087163795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47099b423725dec1%3A0x33f22d6c6059c0c9!2sRestaurace%20Na%20kope%C4%8Dku%20(asian%20fusion)!5e1!3m2!1sen!2scz!4v1760428600736!5m2!1sen!2scz"
        width="100%"
        height="100%"
        className="w-full h-full border-0 object-cover"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}