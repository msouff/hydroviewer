from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from tethys_sdk.gizmos import SelectInput, ToggleSwitch, Button


@login_required()
def home(request):
    """
    Controller for the app home page.
    """

    model_input = SelectInput(display_text='',
                              name='model',
                              multiple=False,
                              options=[('ECMWF', 'wcmwf'), ('LIS', 'lis')],
                              initial=['Model'],
                              original=True)
    context = {
        'model_input': model_input,
    }

    return render(request, 'hydroviewer/home.html', context)