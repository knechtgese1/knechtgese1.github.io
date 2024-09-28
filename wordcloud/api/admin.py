from django.contrib import admin
from .models import User, Word, Upvote

admin.site.register(User)
admin.site.register(Word)
admin.site.register(Upvote)
