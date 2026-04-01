from django.urls import path

from .views import (
    create_razorpay_order,
    locked_slots,
    VerifyPaymentAndCreateBooking,
    AdminAppointmentView,
    AdminPatientView,
    AdminPaymentView,
    AdminAnalyticsView,
    AdminSettingsView,
    AdminSendEmailView,
    AdminRevenueView,
    AdminLeaveTodayView,
    AdminUserListView,
    PatientAppointmentStatusView,
    PatientRescheduleOrRefundView,
    PatientFreeRescheduleView,
    PatientOneClickRescheduleView,
    UserConsultationView,
    UserConsultationDetailView,
    AdminAppointmentDetailView,
    contact_message_create,
    contact_messages_list,
    admin_notifications_list,
    admin_notifications_mark_read,
    patient_list,
    patient_update,
    JoinMeetingProxyView,
    GenerateInvoiceView,
)

urlpatterns = [
    # Payment
    path("create-order/", create_razorpay_order, name="create-order"),
    path("locked-slots/", locked_slots, name="locked-slots"),
    path("razorpay/verify/", VerifyPaymentAndCreateBooking.as_view(), name="verify-payment"),
    path("admin/payments/<int:pk>/invoice/", GenerateInvoiceView.as_view(), name="admin-payment-invoice"),

    # Join Meeting Proxy
    path("join-meeting/<int:pk>/", JoinMeetingProxyView.as_view(), name="join-meeting-proxy"),

    # Contact
    path("contact/", contact_message_create, name="contact-message"),
    path("admin/contact-messages/", contact_messages_list, name="contact-messages-list"),

    # Admin APIs
    path("admin/appointments/", AdminAppointmentView.as_view(), name="admin-appointments"),
    path("admin/appointments/<int:pk>/", AdminAppointmentDetailView.as_view(), name="admin-appointment-detail"),
    path("admin/patients/", AdminPatientView.as_view(), name="admin-patients"),
    path("admin/payments/", AdminPaymentView.as_view(), name="admin-payments"),
    path("admin/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("admin/settings/", AdminSettingsView.as_view(), name="admin-settings"),
    path("admin/send-email/", AdminSendEmailView.as_view(), name="admin-send-email"),
    path("admin/revenue/", AdminRevenueView.as_view(), name="admin-revenue"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("admin/leave-today/", AdminLeaveTodayView.as_view(), name="admin-leave-today"),

    # Patient Paths
    path("patient/status/", PatientAppointmentStatusView.as_view(), name="patient-status"),
    path("patient/reschedule-or-refund/<int:pk>/", PatientRescheduleOrRefundView.as_view(), name="patient-reschedule-refund"),
    path("patient/free-reschedule/", PatientFreeRescheduleView.as_view(), name="patient-free-reschedule"),
    path("patient/one-click-reschedule/", PatientOneClickRescheduleView.as_view(), name="one-click-reschedule"),
    path("patients/", patient_list, name="patient-list"),
    path("patients/<int:pk>/", patient_update, name="patient-update"),

    # User
    path("user/consultations/", UserConsultationView.as_view(), name="user-consultations"),
    path("user/consultations/<int:pk>/", UserConsultationDetailView.as_view(), name="user-consultation-detail"),

    # Admin Notifications
    path("admin/notifications/", admin_notifications_list, name="admin-notifications"),
    path("admin/notifications/mark-read/", admin_notifications_mark_read, name="admin-notifications-mark-read"),
]