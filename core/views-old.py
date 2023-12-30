#from django.views.generic.edit import CreateView
#from .forms import CustomUserCreationForm


"""
class SignUpView(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"
"""
"""
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = CustomUserSerializer
    #permission_classes = [permissions.IsAuthenticated]

    permission_classes = [permissions.AllowAny]  
"""

"""
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
"""



#from core.views import follows, posts, users
#import core.views.follows
#import core.view.posts
#import core.views.users