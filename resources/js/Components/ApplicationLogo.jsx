export default function ApplicationLogo(props) {
    return (
        <img
        src="/imgs/logo.png" // Aquí se carga tu logo desde la carpeta public/images
        alt="Logo MiChanchito🐖"
        className={props.className} // Usa las clases Tailwind proporcionadas (si tienes alguna para el tamaño)
    />
    );
}
