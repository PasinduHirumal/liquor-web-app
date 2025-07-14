import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ConfirmDialog = async ({ title, html, icon = 'warning' }) => {
    const result = await MySwal.fire({
        title: `<strong>${title}</strong>`,
        html: `<small>${html}</small>`,
        icon,
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'swal2-small-popup',
            title: 'swal2-title-sm',
            htmlContainer: 'swal2-html-sm',
            confirmButton: 'swal2-confirm-sm',
            cancelButton: 'swal2-cancel-sm',
        },
        buttonsStyling: false,
    });

    return result.isConfirmed;
};

export default ConfirmDialog;
