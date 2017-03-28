from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from tethys_sdk.gizmos import SelectInput, ToggleSwitch, Button

import requests
import json


@login_required()
def home(request):
    """
    Controller for the app home page.
    """

    model_input = SelectInput(display_text='',
                              name='model',
                              multiple=False,
                              options=[('Select Model', ''), ('ECMWF-RAPID', 'ecmwf'), ('LIS-RAPID', 'lis')],
                              initial=['Select Model'],
                              original=True)
    context = {
        'model_input': model_input,
    }

    return render(request, 'hydroviewer/home.html', context)

@login_required()
def ecmwf(request):
    """
    Controller for the app home page.
    """

    model_input = SelectInput(display_text='',
                              name='model',
                              multiple=False,
                              options=[('Select Model', ''), ('ECMWF-RAPID', 'ecmwf'), ('LIS-RAPID', 'lis')],
                              initial=['ecmwf'],
                              original=True)

    res = requests.get('https://tethys.byu.edu/apps/streamflow-prediction-tool/api/GetWatersheds/',
                       headers={'Authorization': 'Token 72b145121add58bcc5843044d9f1006d9140b84b'})

    watershed_list = json.loads(res.content)
    watershed_list.append(['Select Watershed', ''])

    watershed_select = SelectInput(display_text='',
                                   name='watershed_select',
                                   options=watershed_list,
                                   initial=['Select Watershed'],
                                   original=True)
    context = {
        'model_input': model_input,
        'watershed_select': watershed_select,
    }

    return render(request, 'hydroviewer/ecmwf.html', context)

@login_required()
def lis(request):
    """
    Controller for the app home page.
    """

    model_input = SelectInput(display_text='',
                              name='model',
                              multiple=False,
                              options=[('Select Model', ''), ('ECMWF-RAPID', 'ecmwf'), ('LIS-RAPID', 'lis')],
                              initial=['Select Model'],
                              original=True)
    context = {
        'model_input': model_input,
    }

    return render(request, 'hydroviewer/home.html', context)